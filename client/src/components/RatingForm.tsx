import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface RatingFormProps {
  vendorId: number;
  onSuccess: () => void;
}

export default function RatingForm({ vendorId, onSuccess }: RatingFormProps) {
  const [ratings, setRatings] = useState({
    hygiene: 0,
    foodHandling: 0,
    waterSource: 0,
    wasteDisposal: 0,
  });
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState<string | null>(null);

  const submitRating = trpc.ratings.submit.useMutation({
    onSuccess: () => {
      alert("Rating submitted successfully!");
      setRatings({ hygiene: 0, foodHandling: 0, waterSource: 0, wasteDisposal: 0 });
      setComment("");
      onSuccess();
    },
    onError: (error) => {
      alert("Error: " + error.message);
    },
  });

  const handleRatingChange = (category: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratings.hygiene === 0 || ratings.foodHandling === 0 || ratings.waterSource === 0 || ratings.wasteDisposal === 0) {
      alert("Please rate all categories");
      return;
    }
    submitRating.mutate({
      vendorId,
      hygiene: ratings.hygiene,
      foodHandling: ratings.foodHandling,
      waterSource: ratings.waterSource,
      wasteDisposal: ratings.wasteDisposal,
      comment: comment || undefined,
    });
  };

  const RatingStars = ({ category, label }: { category: keyof typeof ratings; label: string }) => (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoveredRating(`${category}-${star}`)}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => handleRatingChange(category, star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              size={32}
              className={`${
                star <= (hoveredRating === `${category}-${star}` ? star : ratings[category])
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RatingStars category="hygiene" label="Hygiene (Cleanliness & Sanitation)" />
      <RatingStars category="foodHandling" label="Food Handling (Proper Preparation)" />
      <RatingStars category="waterSource" label="Water Source (Clean & Safe)" />
      <RatingStars category="wasteDisposal" label="Waste Disposal (Proper Management)" />

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Additional Comments (Optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this vendor..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={4}
        />
      </div>

      <Button
        type="submit"
        disabled={submitRating.isPending}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
      >
        {submitRating.isPending ? "Submitting..." : "Submit Rating"}
      </Button>
    </form>
  );
}

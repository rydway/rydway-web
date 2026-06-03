"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import RatingStars from "./RatingStars";
import { MessageSquare } from "lucide-react";

interface ReviewFormProps {
  onSubmit: (data: { rating: number; text: string }) => void;
  loading?: boolean;
}

export default function ReviewForm({ onSubmit, loading = false }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, text });
  };

  return (
    <Card className="glassmorphism-card p-6 font-primary">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Leave a Review</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Your Rating</label>
          <RatingStars value={rating} onChange={setRating} size="lg" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-2 block">Your Review</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your experience with this vehicle..."
            rows={4}
            className="resize-none rounded-xl font-secondary"
          />
        </div>

        <Button
          type="submit"
          disabled={rating === 0 || loading}
          className="w-full rounded-xl bg-primary hover:bg-blue-600 text-white"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Card>
  );
}

"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RatingStars from "./RatingStars";
import { Review } from "@/@types";
import { formatTimeAgo, getInitials } from "@/lib/utils";
import { Star } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
  averageRating?: number;
}

export default function ReviewList({ reviews, averageRating }: ReviewListProps) {
  return (
    <div className="space-y-6 font-primary">
      {/* Summary */}
      {averageRating && (
        <Card className="glassmorphism-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</span>
              <RatingStars value={averageRating} readonly size="sm" />
              <span className="text-sm text-slate-600 font-secondary mt-1">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="glassmorphism-card p-6">
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(review.reviewerName)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-slate-800">{review.reviewerName}</h4>
                    <p className="text-xs text-slate-500 font-secondary">{formatTimeAgo(review.createdAt)}</p>
                  </div>
                  <RatingStars value={review.rating} readonly size="sm" />
                </div>
                
                <p className="text-sm text-slate-700 font-secondary leading-relaxed">
                  {review.text}
                </p>
                
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.photos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt="Review"
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Review } from "./types";

interface ReviewsSectionProps {
  reviews?: Review[];
  rating: number;
  totalReviews: number;
}

export function ReviewsSection({ reviews, rating, totalReviews }: ReviewsSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedReviews = showAll ? reviews : reviews?.slice(0, 3);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Reviews & Ratings
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-slate-800 mr-1">{rating}</span>
              <span className="text-sm text-slate-500">/5</span>
            </div>
            <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">
              {totalReviews} reviews
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-5">
            {displayedReviews?.map((review) => (
              <div key={review.id} className="border-b border-slate-100 last:border-0 pb-5 last:pb-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.userAvatar} />
                    <AvatarFallback className="bg-slate-200 text-slate-700 text-xs font-primary">
                      {review.userName ? review.userName.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-medium text-slate-800">{review.userName}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(review.rating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-slate-500 ml-1">
                            {new Date(review.date).toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">{review.comment}</p>
                    {review.renterResponse && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs font-medium text-blue-800 mb-1">Response from host:</p>
                        <p className="text-sm text-blue-700">{review.renterResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {reviews.length > 3 && !showAll && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(true)}
                className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-slate-50"
              >
                View all {reviews.length} reviews
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No reviews yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

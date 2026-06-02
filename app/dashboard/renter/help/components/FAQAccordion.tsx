"use client";

import { useState } from "react";
import { ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FAQCategory } from "./types";

export function FAQAccordion({ category }: { category: FAQCategory }) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);

  return (
    <Card className="shadow-sm overflow-hidden py-0 border-slate-200">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <category.icon className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-slate-800 font-primary">
              {category.title}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5 font-secondary">
              {category.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Accordion 
          type="single" 
          collapsible 
          className="w-full"
          value={openItem}
          onValueChange={setOpenItem}
        >
          {category.questions.map((faq, index) => (
            <AccordionItem key={faq.id} value={`item-${index}`} className="border-slate-200 last:border-0">
              <AccordionTrigger className="py-4 text-sm font-medium text-slate-800 hover:text-blue-600 hover:no-underline font-secondary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-600 leading-relaxed font-secondary">
                <div className="space-y-4 pt-2 pb-3">
                  <p className="whitespace-pre-line">{faq.answer}</p>
                  
                  {faq.related && faq.related.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 mb-2">Related articles:</p>
                      <div className="flex flex-wrap gap-2">
                        {faq.related.map((relatedId) => {
                          const related = category.questions.find(q => q.id === relatedId);
                          if (!related) return null;
                          return (
                            <Button
                              key={relatedId}
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700"
                              onClick={() => {
                                const index = category.questions.findIndex(q => q.id === relatedId);
                                setOpenItem(`item-${index}`);
                              }}
                            >
                              {related.question}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {faq.helpful !== undefined && (
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-slate-500">Was this helpful?</span>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        Yes ({faq.helpful})
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1">
                        <ThumbsDown className="h-3.5 w-3.5" />
                        No
                      </Button>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

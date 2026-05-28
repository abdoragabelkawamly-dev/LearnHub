import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import api from "@/api/axios";
import examService from "@/api/exam";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Star, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

const InstructorSubmissions = () => {
  const { id } = useParams();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["instructor", "submissions", id],
    queryFn: async () => {
      if (!id) return [];
      const response = await examService.getResultsByExam(id);
      return Array.isArray(response)
        ? response
        : response?.data?.data || response?.data || [];
    },
    enabled: !!id,
  });

  const { data: examDetails } = useQuery({
    queryKey: ["exam-details", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await examService.getDetails(id);
      return response?.data || response;
    },
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fade-in pb-20">
      <div className="page__head">
        <div>
          <h1 className="page__title flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            {examDetails?.title || "Exam Submissions"}
          </h1>
          <p className="page__subtitle">
            Monitor performance and review student answers for this final assessment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="surface-glass overflow-hidden">
          <CardHeader className="border-b border-border/60 bg-primary/5">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Exam Results
            </CardTitle>
            <CardDescription>
              Track student scores and completion status.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="data-list">
              <div className="data-list__head grid-cols-[1.5fr,0.8fr,1fr]">
                <span>Student</span>
                <span>Final Score</span>
                <span className="text-right">Actions</span>
              </div>
                {submissions.length > 0 ? (
                  submissions.map((sub) => {
                    const resultId = sub.examResultId || sub.resultId || sub.id;
                    const score = sub.score ?? sub.examResult?.score ?? 0;

                    return (
                      <div
                        key={resultId || `${sub.studentName}-${sub.studentId}`}
                        className="data-list__row grid-cols-[1.5fr,0.8fr,1fr]"
                      >
                        <div className="data-list__cell" data-label="Student">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                              {sub.studentName?.[0] || "S"}
                            </div>
                            <div>
                              <p className="font-bold text-sm">
                                {sub.studentName}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="data-list__cell" data-label="Final Score">
                          <div className="flex items-center gap-2">
                            <span className={`text-xl font-black ${score >= 50 ? "text-green-500" : "text-destructive"}`}>
                              {score}%
                            </span>
                          </div>
                        </div>
                        <div className="data-list__cell data-list__actions" data-label="Actions">
                          <Button 
                            asChild
                            size="sm" 
                            variant="outline" 
                            className="h-8 gap-1"
                          >
                            <Link
                              to={resultId ? `/dashboard/exam-result/${resultId}` : "#"}
                              state={{ lookup: "result" }}
                            >
                              <Star className="w-3 h-3" /> View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="empty-state text-muted-foreground italic">
                      No submissions recorded yet for this exam.
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstructorSubmissions;

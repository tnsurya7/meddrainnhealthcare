import React from "react";
import Image from "next/image";
import { Container } from "../ui/Container";
import { SectionHeading } from "../ui/SectionHeading";
import { PublicStudentShowcaseItem } from "@/lib/db/queries/students";
import { GraduationCap } from "lucide-react";

interface StudentShowcaseProps {
  students: PublicStudentShowcaseItem[];
  isVisible: boolean;
}

export function StudentShowcaseSection({
  students,
  isVisible,
}: StudentShowcaseProps) {
  // If visibility turned off in settings or no approved public consent records exist, render nothing
  if (!isVisible || students.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#F5F8FC] border-b border-[#E2E8F0]">
      <Container size="wide">
        <SectionHeading
          badge="Student Success"
          title="Trainee Showcase & Achievements"
          description="Recognizing our dedicated trainees who have completed biomedical equipment training programs with verified consent."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#10243A] text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {student.photoUrl ? (
                    <Image
                      src={student.photoUrl}
                      alt={student.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{student.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-[#10243A] text-base leading-snug">
                    {student.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#0D9488] font-medium mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Batch: {student.batch}</span>
                  </div>
                </div>
              </div>

              {student.courseName && (
                <div className="inline-block px-2.5 py-1 rounded bg-[#eff4ff] text-[#155EEF] text-xs font-semibold mb-3 self-start">
                  {student.courseName}
                </div>
              )}

              {student.description && (
                <p className="text-sm text-[#64748B] leading-relaxed italic mt-auto">
                  &ldquo;{student.description}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

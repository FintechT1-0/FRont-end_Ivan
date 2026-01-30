import CourseCard from "./CourseCard";

export default function CoursesCarousel({ courses }) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-6 pb-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
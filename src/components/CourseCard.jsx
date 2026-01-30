export default function CourseCard({ course }) {
  return (
    <div className="bg-[#2E5D8C] rounded-[32px] p-4 w-[320px] shrink-0 text-white">
      {/* IMAGE */}
      <div className="bg-white rounded-[24px] h-[180px] mb-4 overflow-hidden">
        {course.image && (
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* TEXT */}
      <h3 className="text-lg mb-2">
        {course.title}
      </h3>

      <p className="text-sm opacity-80 mb-3 line-clamp-2">
        {course.description}
      </p>

      <div className="flex justify-between text-sm opacity-70 mb-3">
        <span>{course.provider}</span>
        <span>{course.duration}</span>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <span className="text-lg">
          ${course.price}
        </span>
        <button className="bg-[#A94F5E] px-5 py-1 rounded-full text-sm">
          View
        </button>
      </div>
    </div>
  );
}
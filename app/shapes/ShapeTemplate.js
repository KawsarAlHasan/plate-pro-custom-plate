import { useRouter } from "next/navigation";

function ShapeTemplate({ shapeList, isLoading, isError, mutate }) {
  const router = useRouter();

  return (
    <div className="p-4">
      <h2 className="text-center mb-4 font-bold">Shape Templates</h2>
      <div className="text-center overflow-scroll h-screen p-4">
        {shapeList?.map((template) => (
          <div
            key={template?.id}
            className="cursor-pointer border p-2 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            onClick={() => router.push(`/shapes?shapeId=${template?.id}`)}
          >
            <img
              src={template?.icon}
              alt={template?.name}
              className="w-[250px]  object-contain mb-2 mx-auto"
            />
            <span>{template?.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShapeTemplate;

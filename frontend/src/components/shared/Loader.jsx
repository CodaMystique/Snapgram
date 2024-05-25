import { Loader as LoaderImg } from "@/assets";

function Loader() {
  return (
    <div className="flex-center w-full">
      <img
        src={LoaderImg}
        alt="loader"
        width={24}
        height={24}
        className="animate-spin"
      />
    </div>
  );
}

export default Loader;

import Button from "@components/Button";
import { Microphone } from "@components/Icons";
import { Fragment } from "react/jsx-runtime";
import senseiUrl from "@assets/sensei.svg";

export default function () {
  return (
    <Fragment>
      <div className="overflow-y-scroll h-[calc(100vh-300px)] px-2">
        <div className="mx-auto w-fit scale-75">
          <img src={senseiUrl} alt="" />
        </div>
        
      </div>
      <div className="sticky bottom-0 h-32 w-full flex gap-3 items-start border rounded-2xl p-3 bg-[#3C3C3C] border-[#3C3C3C]">
        <div className="size-4 rounded-full bg-[#F11313] my-1">
        </div>
        <textarea
          name=""
          id=""
          className="w-full h-full bg-transparent outline-none"
          placeholder="Message sensei..."
        >
        </textarea>
        <Button>
          <Microphone className="p-2 size-8 rounded-xl" />
        </Button>
      </div>
    </Fragment>
  );
}

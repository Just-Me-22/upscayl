import {
  longestEdgeAtom,
  useLongestEdgeAtom,
} from "@/atoms/user-settings-atom";
import { useAtom } from "jotai";
import React from "react";

export function InputLongestEdge() {
  const [useLongestEdge, setUseLongestEdge] = useAtom(useLongestEdgeAtom);
  const [longestEdge, setLongestEdge] = useAtom(longestEdgeAtom);

  return (
    <div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium">Longest edge (px)</p>
        <p className="text-xs text-base-content/80">
          Resize the result so its longer side equals this many pixels, keeping
          the aspect ratio. Works at any aspect ratio and takes priority over
          custom width. Leave off to keep the model's own output size.
        </p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <input
          type="checkbox"
          className="toggle"
          checked={useLongestEdge}
          onClick={(e) => {
            if (!e.currentTarget.checked) {
              localStorage.removeItem("longestEdge");
            }
            setUseLongestEdge(!useLongestEdge);
          }}
        />
        <input
          type="number"
          value={longestEdge}
          disabled={!useLongestEdge}
          onChange={(e) => {
            if (e.currentTarget.value === "") {
              setUseLongestEdge(false);
              setLongestEdge(null);
              localStorage.removeItem("longestEdge");
              return;
            }
            setLongestEdge(parseInt(e.currentTarget.value));
          }}
          step="1"
          min="1"
          className="input input-primary h-7 w-32 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

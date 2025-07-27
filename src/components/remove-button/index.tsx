import clsx from "clsx";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";

function RemoveButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      title="Eliminar"
      {...props}
      type="button"
      className={clsx("ml-2 rounded-md p-1 hover:bg-red-100", props.className)}
    >
      <AiOutlineDelete className="text-red-500" size={16} />
    </button>
  );
}

export default RemoveButton;

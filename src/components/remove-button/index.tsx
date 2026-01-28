import clsx from "clsx";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";

interface RemoveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

function RemoveButton({
  className,
  loading = false,
  ...props
}: RemoveButtonProps) {
  return (
    <button
      title="Eliminar"
      type="button"
      {...props}
      className={clsx(
        "ml-2 grid place-items-center rounded-md p-1 text-red-500 hover:bg-red-100",
        loading ? "bg-red-100" : null,
        className
      )}
    >
      {loading ? (
        <CgSpinner className="animate-spin" size={16} />
      ) : (
        <AiOutlineDelete size={16} />
      )}
    </button>
  );
}

export default RemoveButton;

// components/CustomNode.js
import { Handle, Position } from "reactflow";
import { GENDERS } from "./listConst";

export default function CustomNode({ data }) {
  return (
    <div className="px-4 py-2 shadow rounded bg-white border text-center cursor-pointer">
      <div className="flex space-x-2">
        {/* Image */}
        <img
            src={data.image !== null ? data.image : data.gender === GENDERS[0].value ? "/images/man.png" : "/images/girl.png"}
            alt=""
            className="w-7 h-7 rounded-full border mx-auto object-cover"
          />

        {/* Nom */}
        <div className="font-bold">{data.label}</div>
        </div>

      {/* Points de connexion */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

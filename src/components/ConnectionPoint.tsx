export const ConnectionPoint: React.FC<{
    id: string;
    type: 'input' | 'output';
    label?: boolean;
}> = ({ id, type, label = true }) => {
    return (
        <div className="flex items-center gap-2">
        {label && type === 'output' && (
            <span className="text-sm text-gray-600">output</span>
        )}
        <div
            id={id}
            className={`w-3 h-3 rounded-full bg-[#66A3FF] border-2 border-white ring-2 ring-[#DBDBDB] 
            ${type === 'input' ? 'mr-auto' : 'ml-auto'}`}
            data-connection-point={type}
        />
        {label && type === 'input' && (
            <span className="text-sm text-gray-600">input</span>
        )}
    </div>
    );
};
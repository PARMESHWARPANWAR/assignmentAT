export const ConnectionPoint: React.FC<{
    id: string;
    type: 'input' | 'output';
}> = ({ id, type }) => {
    return (
        <div
            id={id}
            className={`w-3 h-3 rounded-full bg-[#66A3FF] border-2 border-white ring-2 ring-[#DBDBDB]
            ${type === 'input' ? 'mr-auto' : 'ml-auto'}`}
            data-connection-point={type}
        />
    );
};
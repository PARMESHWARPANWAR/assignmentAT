export const ConnectionPoint: React.FC<{
    id: string;
    type: 'input' | 'output';
}> = ({ id, type }) => {
    return (
        <div
            id={id}
            className={`w-3 h-3 rounded-full bg-blue-500 border-2 border-white ring-2 ring-gray-200
            ${type === 'input' ? 'mr-auto' : 'ml-auto'}`}
            data-connection-point={type}
        />
    );
};
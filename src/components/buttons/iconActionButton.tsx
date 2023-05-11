type IconActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

function IconActionButton({
  children,
  onClick,
  disabled = false,
}: IconActionButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="p-2 mt-4 rounded-lg bg-primary-500 text-gray-200 inline-flex items-center gap-2 justify-center hover:text-gray-600 hover:bg-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}

export default IconActionButton;

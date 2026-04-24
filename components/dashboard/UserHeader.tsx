type User = {
  name: string;
  email: string;
};

export default function UserHeader({ user }: { user: User }) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      
      {/* TEXT */}
      <div className="text-right">
        <p className="text-sm font-semibold text-white">
          {user.name}
        </p>
        <p className="text-xs text-gray-400">
          {user.email}
        </p>
      </div>

      {/* AVATAR */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-sm font-bold">
        {initial}
      </div>
    </div>
  );
}
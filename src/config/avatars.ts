export interface Avatar {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
}

export const avatars: Avatar[] = [
  { id: "avatar-1", name: "Explorer Blue", emoji: "🚀", bgColor: "bg-blue-100" },
  { id: "avatar-2", name: "Explorer Purple", emoji: "🔮", bgColor: "bg-purple-100" },
  { id: "avatar-3", name: "Scientist Green", emoji: "🔬", bgColor: "bg-green-100" },
  { id: "avatar-4", name: "Scientist Orange", emoji: "⚗️", bgColor: "bg-orange-100" },
  { id: "avatar-5", name: "Scholar Red", emoji: "📚", bgColor: "bg-red-100" },
  { id: "avatar-6", name: "Scholar Teal", emoji: "🎓", bgColor: "bg-teal-100" },
  { id: "avatar-7", name: "Artist Pink", emoji: "🎨", bgColor: "bg-pink-100" },
  { id: "avatar-8", name: "Coder Yellow", emoji: "💻", bgColor: "bg-yellow-100" },
];

export function getAvatarById(id: string): Avatar | undefined {
  return avatars.find((a) => a.id === id);
}

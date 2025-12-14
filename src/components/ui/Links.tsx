interface SocialLinkProps {
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}
export const SocialLink = ({ href, icon: Icon, label }:SocialLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative p-2 text-gray-400 hover:text-[#cbaefd] transition-colors duration-300"
    >
    
      <Icon className="w-5 h-5" />
      <span className="absolute bottom-full  left-1/2 -translate-x-1/2  px-2 py-1 text-xs font-medium text-black bg-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ">
        {label}
      </span>
    </a>
  );
};
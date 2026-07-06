

const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-bg-0 py-8 mt-24">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-6 h-6 rounded bg-primary-cyan flex items-center justify-center opacity-70">
            <span className="font-bold text-bg-0 text-sm">F</span>
          </div>
          <span className="text-sm font-medium text-gray-500">© 2026 Fuenzer Sports. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a href="#" className="hover:text-primary-cyan transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-cyan transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary-cyan transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

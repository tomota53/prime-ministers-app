import { Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          {/* アプリ情報 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              🎩 首相マスターについて
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              中学受験に向けて、歴代内閣総理大臣を楽しく効率的に学習できるアプリです。
              重要7首相から主要33首相まで、クイズや暗記カードでいつでもどこでも学習できます。
            </p>
          </div>

          {/* お問い合わせ */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">
              📧 お問い合わせ
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:tomota53@yahoo.co.jp"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail size={16} />
                <span>tomota53@yahoo.co.jp</span>
              </a>

              <p className="text-xs text-gray-500 pt-2">
                バグ報告、機能リクエスト、<br />
                ご質問などお気軽にどうぞ
              </p>
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-300 my-6"></div>

        {/* コピーライト */}
        <div className="text-center">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <span>© {currentYear} 首相マスター.</span>
            <span>Made with</span>
            <Heart size={14} className="text-red-500" fill="currentColor" />
            <span>for 受験生</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            本アプリは教育目的で作成されています
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

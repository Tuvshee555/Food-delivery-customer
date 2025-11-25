/* eslint-disable react/no-unescaped-entities */
export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* LEFT SIDE - Logo + Description + Facebook widget */}
        <div>
          {/* <img src="/logo.png" alt="MongolZ" className="w-12 h-12 mb-4" /> */}
          <p className="text-sm leading-relaxed mb-4">
            The MongolZ Esports Organization's Official Merchant Store for Horde
            in Mongolia. We have something big coming up soon. So, please stay
            tuned, all Horde!
          </p>

          {/* Facebook page plugin box */}
          <div className="w-full bg-[#111] p-3 rounded">
            {/* <img src="/fb-box.png" alt="Facebook Widget" className="w-full" /> */}
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-5">
            <i className="fa-brands fa-facebook text-2xl"></i>
            <i className="fa-brands fa-instagram text-2xl"></i>
            <i className="fa-brands fa-youtube text-2xl"></i>
          </div>
        </div>

        {/* COLUMN 2 – Туслах цэс */}
        <div>
          <h3 className="font-semibold mb-4">Туслах цэс</h3>
          <ul className="space-y-2 text-sm">
            <li>Бидний тухай</li>
            <li>Холбоо барих</li>
            <li>Түгээмэл асуулт</li>
            <li>Нийтлүүлуд</li>
            <li>Ажлын байр</li>
            <li>Салбарууд</li>
          </ul>
        </div>

        {/* COLUMN 3 – Бүтээгдэхүүн */}
        <div>
          <h3 className="font-semibold mb-4">Бүтээгдэхүүн</h3>
          <ul className="space-y-2 text-sm">
            <li>Бүх бүтээгдэхүүн</li>
            <li>Онцлох бүтээгдэхүүн</li>
            <li>Бестселлер</li>
            <li>Хямдарсан бүтээгдэхүүн</li>
          </ul>
        </div>

        {/* COLUMN 4 – Contact */}
        <div>
          <h3 className="font-semibold mb-4">Холбоо барих</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-phone"></i> 2990
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-envelope"></i> contact@mongolz.shop
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm text-gray-400">
        ©2025 Онлайн худалдааг хөнгөвчлөгч
        <span className="text-pink-500 font-bold px-2">ZOCHIL</span>
        платформ.
      </div>
    </footer>
  );
}

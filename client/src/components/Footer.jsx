import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
        <div className='bg-[#F6F9FC] text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='mb-4 h-8 md:h-9 invert opacity-80' />
                    <p className='text-sm'>
                        Discover the most extraordinary places to stay, from boutique hotels to luxury villas and private islands.</p>
                    <div className='flex items-center gap-3 mt-4'>
                       
                        <img src={assets.instagramIcon} alt="instagram-icon" className='w-6'/>
                        <img src={assets.facebookIcon} alt="facebook-icon" className='w-6'/>
                        <img src={assets.twitterIcon} alt="twitter-icon" className='w-6'/>
                        <img src={assets.linkendinIcon} alt="linkedin-icon" className='w-6'/>
                       
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Partners</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-lg text-gray-800'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className='font-playfair text-lg text-gray-800'>STAY UPDATED</p>
                    <p className='mt-3 text-sm'>
                        Subscribe to our newsletter for inspiration and special offers.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input type="text" className='bg-white rounded-l border border-gray-300 h-9 px-3 outline-none' placeholder='Your email' />
                        <button className='flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r'>
                            {/* Arrow icon */}
                            <img src={assets.arrowIcon} alt="arrow-icon" className='w-3.5 invert'/>
                          </button>
                    </div>
                    <ul className='flex items-center gap-4 mt-4 text-sm'>
                        <li><a href="#" className='hover:text-black transition-colors'>Privacy</a></li>
                        <li><a href="#" className='hover:text-black transition-colors'>Terms</a></li>
                        <li><a href="#" className='hover:text-black transition-colors'>Sitemap</a></li>
                    </ul>
                </div>
            </div>
            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} <a href="/" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className='text-gray-800 font-semibold hover:text-black transition-colors'>QuickStay</a>. All rights reserved.</p>
                <p>
                    Designed &amp; Developed by&nbsp;
                    <a href="https://mayank-developer.vercel.app/" target="_blank" rel="noopener noreferrer" className='text-gray-800 font-semibold hover:text-black transition-colors'>
                        Mayank Singh
                    </a>
                </p>
            </div>
        </div>
    )
}
  
export default Footer

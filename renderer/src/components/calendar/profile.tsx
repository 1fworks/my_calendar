import { useEffect, useState } from "react";
import { LuUser } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import { BiPlusCircle } from "react-icons/bi";
import { MdCancel } from "react-icons/md";

export const Profile = ({
  savfileSlot,
}:{
  savfileSlot: number,
}) => {
  const [ active, setActive ] = useState<boolean>(false)

  useEffect(()=>{
    if(!active) {
      // save
    }
  }, [active])

	return (
    <>
      <div
        className={`overlay ${active?'overlay-active cursor-pointer':''}`}
        onClick={()=>{
          if(active) setActive(false)
        }}
      >
        <div className="overlay-shadow" />
        <div className="drawer" onClick={e=>e.stopPropagation()}>
          { active && 
            <div className="w-full h-full flex flex-col gap-2">
              <div className="w-full ml-auto pt-2 pl-2 pr-2 flex flex-row gap-2">
                <div className="flex-1 flex flex-row gap-2 items-center mini-svg">
                  <LuUser />
                  <span className="font-bold text-lg memo-underline">Profile</span>
                </div>
                <button
                  className="theme-switch"
                  onClick={()=>{
                    if(active) setActive(false)
                  }}
                >
                  <MdCancel />
                </button>
              </div>

              <div className="relative flex-1 overflow-y-scroll mr-2 pb-3 px-2">
                <div className="flex flex-col gap-2">

                  <div className="flex flex-row items-center gap-1">
                    <button className="div-border theme-switch">
                      {/* <FaCheck /> */}
                      <LuUser />
                    </button>
                    <input className="div-border py-1 px-2" value="My Profile" />
                  </div>

                  <hr className="opacity-50" />

                  <button className="div-border mini-svg flex flex-row items-center justify-center">
                    <BiPlusCircle />
                    <span>add new profile</span>
                  </button>

                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <button
        className="theme-switch"
        onClick={()=>{
          setActive(!active)
        }}
      >
        <LuUser />
      </button>
    </>
	)
}
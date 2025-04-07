import { FaRegNoteSticky } from "react-icons/fa6";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useEffect, useState } from "react";

export const NoteBook = () => {
  const [ active, setActive ] = useState<boolean>(false)

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
            <div className="w-full flex flex-col gap-2">
              <div className="w-full ml-auto pt-2 pl-4 pr-2 flex flex-row items-center gap-2">
                <span className="flex-1 font-bold text-lg">메모지</span>
                <button
                  className="theme-switch"
                  onClick={()=>{
                    if(active) setActive(false)
                  }}
                >
                  <MdCancel />
                </button>
              </div>
              { [1, 2, 3, 4, 5].map((element, i)=>{
                return (
                  <div className="mx-2 p-2 div-border mini-svg h-fit flex flex-row gap-2">
                    <div className="w-fit h-fit">
                      <button className="theme-switch"><FaHeart /></button>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="text-sm">
                        2025년 1월 1일
                      </div>
                      <div>
                        메모 내용
                      </div>
                    </div>
                  </div>
                )
              })}
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
        <FaRegNoteSticky />
      </button>
    </>
	)
}
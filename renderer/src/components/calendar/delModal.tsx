import { createPortal } from "react-dom"

export const DelModal = ({
	delFunc,
	closeModal,
}:{
	delFunc:()=>void,
	closeModal:()=>void,
}) => {
  return createPortal((
		<div className={`absolute left-0 top-0 w-dvw h-dvh z-[100]`}>
			<div className="absolute w-full h-full drawer opacity-70 -z-10" />
			<div className="absolute w-full h-full -z-20 backdrop-blur-[2px]" />
			<div className="w-full h-full flex justify-center items-center">
				<div>
					<p className="date-text">정말 삭제하시겠습니까?</p>
					<div className="flex justify-center gap-4 my-2">
						<button className="px-2" onClick={()=>{
							delFunc()
							closeModal()
						}}>확인</button>
						<button className="px-2" onClick={()=>{
							closeModal()
						}}>취소</button>
					</div>
				</div>
			</div>
		</div>
	), document.getElementsByClassName('calendar')[0])
}
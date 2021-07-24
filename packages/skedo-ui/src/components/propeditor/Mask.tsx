

interface MaskProps {
  children : React.ReactNode,
  onClick : React.MouseEventHandler ,
  display : boolean
}


const Mask = ({ children, onClick, display }: MaskProps) => {
  return (
    <div>
      <div
        style={{
          display : display ? "block" : "none",
          position: "fixed",
          top: 0,
          left : 0,
          width: "100%",
          height: "100%", 
          backgroundColor: "black",
          opacity: 0.2,
        }}
        onClick={onClick}
      >
      </div>
      {children}
    </div>
  )
}

export default Mask
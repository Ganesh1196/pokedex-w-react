import ReactDom from "react-dom"

export default function Modal(props){
    const {children, handleCloseModal} = props // This is destructed and the content that comes here will be from PokeCard return div
    return ReactDom.createPortal(
        <div className="modal-container">
            <button onClick={handleCloseModal} className="modal-underlay"></button>
            <div className="modal-content">
                {children} {/**the content in this might be a whole div instead of just a single value */}
            </div>
        </div>,

        document.getElementById("portal")
    )
}
import { useParams } from "react-router-dom"

const EditHotel = () => {
  const { hotelId } = useParams();
  return(
    <div>
      {hotelId}
    </div>
  )
}

export default EditHotel;
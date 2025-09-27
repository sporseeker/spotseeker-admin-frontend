import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const AlertSwal = withReactContent(Swal)

export const Alert = (title, icon) => {
    return AlertSwal.fire({
        title,
        icon,
        customClass: {
          confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    })
}
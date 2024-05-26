export default function formValidator() {

    function arePasswordEqual(password1, password2) {
        return password1 === password2
    }


    return {
        arePasswordEqual
    }
}
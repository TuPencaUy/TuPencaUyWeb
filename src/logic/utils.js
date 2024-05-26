export default function utils()
{
    function showLoader()
    {
        const loader = document.querySelector('.loader-modal');
        if (!loader) return;

        loader.classList.remove('hidden');
    }

    function hideLoader()
    {
        const loader = document.querySelector('.loader-modal');
        if (!loader) return;

        loader.classList.add('hidden');
    }

    return {
        showLoader,
        hideLoader
    };
}

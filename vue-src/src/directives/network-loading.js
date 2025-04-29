function updateLoading(el, value){
  if (value){
    el.classList.add("network-loading")
  }else if (el.classList.contains("network-loading")){
    el.classList.remove("network-loading")
  }
}
export default function newtWorkLoadingDirective(app) {
  app.directive('network-loading', {
    mounted(el, binding) {
     updateLoading(el, binding.value)
    },
    updated(el, binding){
      updateLoading(el, binding.value)
    }
  })
}

Component({
  data: {},
  properties: {
    tabs:{
      type:Array
    }
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  methods: {
    handleTap(e){
      const {index} = e.currentTarget.dataset
      this.triggerEvent("itemChange",{index})
    }
  }
})
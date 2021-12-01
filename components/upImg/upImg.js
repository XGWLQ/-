Component({
  data: {},
  properties: {
    src: {
      type: String,
      value: ""
    }
  },
  methods: {
    handleDelImg(){
     this.triggerEvent("delImg")
    }
  }
})
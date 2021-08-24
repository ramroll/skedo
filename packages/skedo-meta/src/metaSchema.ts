export const metaSchema = {
  id : "/meta",
  type : 'object',
  required: ["name", "imageUrl", "title", "group", "componentType", "box"],
  properties : {
    componentType : {
      type : "string"
    },
    group: {
      type : "string"
    },
    name: {
      type : "string"
    },
    imageUrl: {
      type : 'string'
    },
    title : {
      type : 'string'
    },
    editor : {
      type : 'object',
      properties : {
        groups : {
          type : 'array',
          items : {
            type : 'object',
            properties : {
              props : {
                type : "array",
                items : {
                  type : 'object',
                  properties : {
                    path : {
                      type : 'string'
                    }
                  },
                  required : ['path']
                }
              }
            }
          }
        }
      }
    },
  },

}


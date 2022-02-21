import { FormDSL } from "./component/form";
import { Form } from "./component/form/Form";
// 统一(uniform)
// 1 基础信息
// 2 产品
const userForm: FormDSL = {
  type: "form",
  children: [
    {
      type: "form-group",
      children: [
        {
          type: "input",
          path: ["basic", "username"],
          props : {
            label : "用户名"
          }
        },
        {
          type: "single-choice",
          path: ["basic", "sex"],
          props: {
            label : "性别",
            selection: [
              { value: "male", label: "男" },
              { value: "female", label: "女" },
            ],
          },
        },
      ],
    },
    {
      type: "form-group",
      children: [
        {
          type: "text",
          path: ["product", "detail"],
        },
        {
          type: "branch",
          // Google Analysis
          name : "branch-1",
          hooks : {
            onDataChange(key : string, value : any, context : Form) {
              if(key === 'basic.sex') {
                const node = context.findByName('branch-1')!
                node.setProps(props => {

                  console.log('set props')
                  return {...props, active : value === 'male' ? 0 : 1}
                })
              }
            }
          },
          children: [
            {
              type: "single-choice",
              path: ["product", "color"],
              props: {
                label : "颜色",
                selection: [
                  { value: "red", label: "红色" },
                  { value: "blue", label: "蓝色" },
                ],
              },
            },
            {
              type: "single-choice",
              path: ["product", "shape"],
              props: {
                label : "形状",
                selection: [
                  { value: "box", label: "方形" },
                  { value: "circle", label: "圆形" },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};

export default userForm
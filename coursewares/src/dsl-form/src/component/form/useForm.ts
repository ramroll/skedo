import { FormDSL } from ".";
import { Form } from "./Form";

export function useForm(dsl : FormDSL, initialValues? : any) {
  const form = new Form(dsl, initialValues)
  return form
}
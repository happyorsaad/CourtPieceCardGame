import validator from "validator";

export interface ValidationResult {
  valid: boolean;
  error: string;
}

export type StringValidator = (text: string) => ValidationResult;

export const isNotEmpty: StringValidator = (text) => {
  return validator.isEmpty(text)
    ? {
        valid: false,
        error: "Field Should Not Be Empty !",
      }
    : {
        valid: true,
        error: "",
      };
};

export const noSpaces: StringValidator = (text) => {
  return validator.contains(text, " ")
    ? {
        valid: false,
        error: "Field Should Not Contain Spaces !",
      }
    : {
        valid: true,
        error: "",
      };
};

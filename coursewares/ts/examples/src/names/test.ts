/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

import { Validation } from './LettersOnlyValidator'
const validator = new Validation.LettersOnlyValidator()

validator.isAcceptable("abc")
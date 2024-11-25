import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'OneOf', async: false })
class OneOfConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean {
      const [relatedValues] = args.constraints;
      return relatedValues && Array.isArray(relatedValues) ? relatedValues.includes(value) : false;
    }
  
    defaultMessage(args: ValidationArguments): string {
      const [relatedValues] = args.constraints;
      return `${args.property} must match one of the following values: ${relatedValues.join(', ')}`;
    }
  }
  
  export function OneOf(
    validValues: any[],
    validationOptions?: ValidationOptions,
  ): PropertyDecorator {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [validValues],
        validator: OneOfConstraint,
      });
    };
  }
  
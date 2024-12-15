#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <module-name>"
  exit 1
fi

MODULE_NAME=$1
BASE_DIR="../src"

echo "Generating DELETE soft API for module: $MODULE_NAME..."

# 1. Controller
CONTROLLER_DIR="${BASE_DIR}/interface/controller/${MODULE_NAME}/delete-${MODULE_NAME}"
mkdir -p $CONTROLLER_DIR
cat <<EOF > $CONTROLLER_DIR/delete-${MODULE_NAME}.controller.ts
import { Request, Response, NextFunction } from 'express';

export const delete${MODULE_NAME^}Controller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await delete${MODULE_NAME^}UseCase(req.body, mysql${MODULE_NAME^}Repo, res.locals.transaction);
    handleResult(req, res, next, StatusCodes.OK, 'OK', result);
  } catch (error) {
    next(error);
  }
};
EOF

# 2. Use Case
USECASE_DIR="${BASE_DIR}/application/usecase/${MODULE_NAME}/delete-${MODULE_NAME}"
mkdir -p $USECASE_DIR
cat <<EOF > $USECASE_DIR/delete-${MODULE_NAME}.usecase.ts
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Transaction } from 'sequelize';

export const delete${MODULE_NAME^}UseCase = async (
  data: ${MODULE_NAME^}Entity,
  repo: ${MODULE_NAME^}RepoInterface,
  t: Transaction
): Promise<E.Either<ApplicationError, void>> => {
  const affectedRowCount = await repo.delete(data, t)

  /**
   * If no rows are affected, return an error indicating no input was found
   */
  if (!affectedRowCount) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }
};

  // delete new record
  const deleteedRecord = await repo.delete(data, t);
  return E.right(deleteedRecord);
};
EOF

# 4. Validation
VALIDATION_DIR="${BASE_DIR}/interface/validation/${MODULE_NAME}"
mkdir -p $VALIDATION_DIR
cat <<EOF > $VALIDATION_DIR/delete-${MODULE_NAME}.validation.ts
import * as Joi from 'joi';

export const delete${MODULE_NAME^}Schema = Joi.object({
  id: Joi.string().required().description('${MODULE_NAME^} ID')
});
EOF

# 5. Entity
ENTITY_DIR="${BASE_DIR}/domain/entities/${MODULE_NAME}/delete"
mkdir -p $ENTITY_DIR
cat <<EOF > $ENTITY_DIR/${MODULE_NAME}.interface.ts
export interface ${MODULE_NAME^}Entity {
  id: string;
}
EOF

echo "delete API for module $MODULE_NAME generated successfully!"

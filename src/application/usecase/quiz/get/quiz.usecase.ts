import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { Transaction } from 'sequelize'
import { Pagination } from '../../../../domain/entities/common/pagination'
import { Quiz200DataDataInner } from '../../../../domain/entities/quiz/get-quiz.interface'
import { ApplicationError } from '../../../../infrastructure/configs/constants/application-tag'
import { QUIZ_TYPE } from '../../../../infrastructure/configs/constants/enums'
import { StatusCodes } from '../../../../infrastructure/configs/constants/statusCodes'
import { formatError } from '../../../../infrastructure/helpers/res'
import { VocabularyRepoInterface } from '../../../../infrastructure/orm/repositories/mysql-repositories/vocabulary/vocabulary-repo.interface'

export const getQuizUseCase = async (
  paginationData: Pagination,
  typeOfQuestion: QUIZ_TYPE,
  repo: VocabularyRepoInterface,
  t: Transaction,
): Promise<E.Either<ApplicationError, Quiz200DataDataInner[]>> => {
  // Fetch questions based on pagination
  const questions = await repo.get(paginationData, t, true)

  if (O.isNone(questions)) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }

  // Fetch options for all question types
  const questionData = questions.value

  const questionTypes = [
    ...new Set(questionData.map((item) => item.type as string)),
  ]
  const vocabGroupIds = [
    ...new Set(questionData.map((item) => item.vocab_group_id as number)),
  ]

  const optionsResult = await repo.getOption(
    questionTypes,
    vocabGroupIds,
    t,
    true,
  )

  if (O.isNone(optionsResult)) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }

  const optionsData = optionsResult.value

  // Generate quiz data
  const quiz = questionData.map((item) => {
    let isWordToMeaning
    if (typeOfQuestion === 'word') {
      isWordToMeaning = true
    } else if (typeOfQuestion === 'meaning') {
      isWordToMeaning = false
    } else {
      isWordToMeaning = Math.random() > 0.5
    }

    const question = isWordToMeaning
      ? item.word + `${item.note_word ? ' - ' + item.note_word : ''}`
      : item.meaning
    const answer = isWordToMeaning
      ? item.meaning
      : item.word + `${item.note_word ? ' - ' + item.note_word : ''}`

    // Generate options by filtering options for the same type and shuffling
    const relatedOptions = optionsData.filter(
      (option) => option.type === item.type,
    )
    const optionPool = relatedOptions.map((opt) =>
      isWordToMeaning
        ? opt.meaning
        : opt.word + `${opt.note_word ? ' - ' + opt.note_word : ''}`,
    )

    // Ensure answer is included in options
    const uniqueOptions = [...new Set([answer, ...optionPool])]
    const shuffledOptions = shuffleArray(uniqueOptions).slice(0, 4)

    // Add the correct answer if not already included
    if (!shuffledOptions.includes(answer)) {
      shuffledOptions.pop()
      shuffledOptions.push(answer)
    }

    // Shuffle again to ensure randomness
    const finalOptions = shuffleArray(shuffledOptions)

    return {
      vocab_id: item.id,
      question,
      options: finalOptions,
      answer,
    }
  })

  return E.right(quiz)
}

/**
 * Utility function to shuffle an array
 * @param array Array to shuffle
 * @returns Shuffled array
 */
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item)
}

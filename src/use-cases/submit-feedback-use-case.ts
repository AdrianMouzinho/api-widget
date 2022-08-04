import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbacksRepository } from "../repositories/feedbacks-repository";

interface SubmitFeedbackUseCaseRequest {
  type: string;
  comment: string;
  screenshot?: string;
}

export class SubmitFeedbackUseCase {
  constructor(
    private feedbackRepository: FeedbacksRepository,
    private mailAdapter: MailAdapter,
  ) {}

  async execute({ type, comment, screenshot }: SubmitFeedbackUseCaseRequest) {
    if(!type) {
      throw new Error('Type is required.');
    }

    if(!comment) {
      throw new Error('Comment is required.');
    }

    if(screenshot && !screenshot.startsWith('data:image/png;base64')) {
      throw new Error('Format invalid.');
    }

    await this.feedbackRepository.create({
      type,
      comment,
      screenshot
    });

    await this.mailAdapter.sendMail({
      subject: 'Novo feedback',
      body: [
        '<div style="padding: 16px; background-color: #EEE; font-family: sans-serif; font-size: 16px; color: #444;">',
        `<p>Tipo de feedback: ${type}</p>`,
        `<p>Comentário: ${comment}</p>`,
        `<p style="text-align: center;">`,
        `<img src=${screenshot} width="100%" alt="${comment}">`,
        `</p>`,
        '</div>',
      ].join('\n')
    });
  }
}
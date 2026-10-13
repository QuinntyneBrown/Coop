using FluentValidation;

namespace Coop.Application.CMS.Board.Commands.SaveBoardOfDirectors;

/// <summary>Rules for each director on the list (L2-REQ-086 AC5).</summary>
public class SaveBoardOfDirectorsValidator : AbstractValidator<SaveBoardOfDirectorsRequest>
{
    public SaveBoardOfDirectorsValidator()
    {
        RuleFor(x => x.Directors).NotNull();
        RuleForEach(x => x.Directors).NotNull().ChildRules(director =>
        {
            director.RuleFor(d => d.Name).NotEmpty().WithMessage("Give the director's name").MaximumLength(100);
            director.RuleFor(d => d.Title).NotEmpty().WithMessage("Give the director's role on the board").MaximumLength(100);
            director.RuleFor(d => d.PhotoUrl).MaximumLength(2048);
        });
    }
}

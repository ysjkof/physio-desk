import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import StateBadge from '../../../../_legacy_components/atoms/StateBadge';
import CardContainer from '../../../../_legacy_components/templates/CardContainer';
import { cls, StayingState } from '../../../../utils/utils';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  loading?: boolean;
}

function Button({ loading, children, ...args }: ButtonProps) {
  return (
    <div className="flex h-full w-full items-center border-t">
      <button
        {...args}
        className={cls(
          'flex w-full items-center justify-center hover:cursor-pointer hover:font-semibold',
          loading ? 'pointer-events-none' : ''
        )}
      >
        {loading ? (
          <FontAwesomeIcon
            icon={faSpinner}
            fontSize={16}
            className="absolute mx-auto animate-spin"
          />
        ) : (
          children
        )}
      </button>
    </div>
  );
}

function ButtonContainer({ children }: PropsWithChildren) {
  return <div className="BUTTONS flex h-1/3 divide-x"> {children}</div>;
}

interface CardProps {
  clinicName: string;
  children: React.ReactNode;
  isActivate: boolean;
  state: StayingState;
}

function ClinicCard({ clinicName, state, isActivate, children }: CardProps) {
  return (
    <div
      className={cls(
        'flex h-24 w-80 flex-col justify-between rounded-md border',
        state === '관리자' ? '-order-1' : '',
        !isActivate ? 'font-light text-gray-500' : 'font-medium'
      )}
    >
      <div className="relative flex h-2/3 flex-col justify-center px-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-base">
            {clinicName}
          </span>
          <StateBadge state={state} />
        </div>
        <p>{isActivate || <span> #폐쇄</span>}</p>
      </div>
      {children}
    </div>
  );
}

ClinicCard.Button = Button;
ClinicCard.ButtonContainer = ButtonContainer;
ClinicCard.Container = CardContainer;

export default ClinicCard;

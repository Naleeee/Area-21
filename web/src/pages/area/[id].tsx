import styles from '@/styles/HandleArea.module.scss';
import {Button, Input, LoadingPage, NavBar, Select} from '@/components';
import React, {useState, useEffect, FormEventHandler} from 'react';
import {
  editArea,
  getArea,
  getAllActions,
  getAllReactions,
  getAllServices,
  getOauthList,
} from '@/scripts/Utils';
import {NextRouter, useRouter} from 'next/router';
import {
  Action,
  AreaType,
  Argument,
  Config,
  Oauth,
  Option,
  Reaction,
  Service,
  User,
} from '@/types';

const EditArea = ({config, user}: {config: Config; user: User}) => {
  const router: NextRouter = useRouter();
  const [title, setTitle] = useState<string>('test');
  const [action, setAction] = useState<Option | null>(null);
  const [reaction, setReaction] = useState<Option | null>(null);
  const [optionsAction, setOptionsAction] = useState<Array<Option> | null>(
    null
  );
  const [optionsReaction, setOptionsReaction] = useState<Array<Option> | null>(
    null
  );
  const [args, setArguments] = useState<{action: Argument; reaction: Argument}>(
    {action: {}, reaction: {}}
  );
  const [errorForm, setErrorForm] = useState<Boolean>(false);

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setErrorForm(false);
    setTitle(e.target.value);
  };
  const handleAction = (e: {value: string}): void => {
    setErrorForm(false);
    const optionsFiltered: Array<Option> | undefined = optionsAction?.filter(
      option => option.value == e.value
    );
    if (optionsFiltered && optionsFiltered.length > 0) {
      setAction(optionsFiltered[0]);
      setArguments({...args, action: {}});
    }
  };
  const handleReaction = (e: {value: string}): void => {
    setErrorForm(false);
    const optionsFiltered: Array<Option> | undefined = optionsReaction?.filter(
      option => option.value == e.value
    );
    if (optionsFiltered && optionsFiltered.length > 0) {
      setReaction(optionsFiltered[0]);
      setArguments({...args, reaction: {}});
    }
  };
  const handleArgument = (
    e: React.ChangeEvent<HTMLInputElement>,
    argument: string,
    type: string
  ): void => {
    const newActions: Argument = args.action;
    const newReactions: Argument = args.reaction;
    if (type == 'action') newActions[argument] = e.target.value;
    else newReactions[argument] = e.target.value;

    setArguments({
      action: newActions,
      reaction: newReactions,
    });
  };
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!formIsValid()) {
      setErrorForm(true);
      return;
    }
    const response: any = await editArea(
      config.api,
      router.query.id,
      user,
      title,
      action?.value,
      reaction?.value,
      args
    );
    if (response) router.push('/dashboard');
  };
  const formIsValid = (): Boolean => {
    if (!title || title.length == 0 || !action || !reaction) return false;
    let error: Boolean = false;
    action.arguments?.forEach((argument: string) => {
      if (!args.action[argument] || args.action[argument].length == 0)
        error = true;
    });
    if (error) return false;
    reaction.arguments?.forEach((argument: string) => {
      if (!args.reaction[argument] || args.reaction[argument].length == 0)
        error = true;
    });
    if (error) return false;
    return true;
  };

  useEffect(() => {
    (async () => {
      const newArgs: {action: Argument; reaction: Argument} = {
        action: {},
        reaction: {},
      };
      const area: AreaType = await getArea(
        config.api,
        user.token,
        router.query.id
      );
      if (area) setTitle(area.title);

      const oauthList: Array<Oauth> = await getOauthList(
        config.api,
        user.id,
        user.token
      );
      const services: Array<Service> = await getAllServices(
        config.api,
        user.token
      );
      const newActions: Array<Action> = await getAllActions(
        config.api,
        user.token
      );
      if (area && newActions && newActions.length != 0) {
        const options: Array<Option> = [];
        newActions.forEach((action: Action) => {
          if (
            oauthList.filter(
              (oauth: Oauth) => oauth.service_id === action.service_id
            ).length > 0 ||
            action.action_id === area.action_id
          ) {
            options.push({
              label: action.name,
              value: action.action_id.toString(),
              service: services.filter(
                (service: Service) => service.service_id === action.service_id
              )[0].name,
              arguments: action.arguments
                ? Object.keys(action.arguments)
                : null,
            });
          } else if (action.service_id === 2) {
            // weather service id
            options.push({
              label: action.name,
              value: action.action_id.toString(),
              service: services.filter(
                (service: Service) => service.service_id === action.service_id
              )[0].name,
              arguments: action.arguments
                ? Object.keys(action.arguments)
                : null,
            });
          }
        });
        setOptionsAction(options);
        const optionsFiltered: Array<Option> = options.filter(
          (option: Option) => option.value == area.action_id.toString()
        );
        if (optionsFiltered.length == 0) optionsFiltered.push(options[0]);

        setAction(optionsFiltered[0]);
        optionsFiltered[0].arguments?.forEach((argument: string) => {
          newArgs.action[argument] =
            area.action_arguments && area.action_arguments[argument]
              ? area.action_arguments[argument]
              : '';
        });
      } else {
        setOptionsAction([]);
        setAction({
          value: undefined,
          label: undefined,
          service: undefined,
          arguments: undefined,
        });
      }
      const newReactions: Array<Reaction> = await getAllReactions(
        config.api,
        user.token
      );
      if (area && newReactions && newReactions.length != 0) {
        const options: Array<Option> = [];
        newReactions.forEach((reaction: Reaction) => {
          if (
            oauthList.filter(
              (oauth: Oauth) => oauth.service_id === reaction.service_id
            ).length > 0 ||
            reaction.reaction_id === area.reaction_id
          ) {
            options.push({
              label: reaction.name,
              value: reaction.reaction_id.toString(),
              service: services.filter(
                (service: Service) => service.service_id === reaction.service_id
              )[0].name,
              arguments: reaction.arguments
                ? Object.keys(reaction.arguments)
                : null,
            });
          } else if (reaction.service_id === 2) {
            // weather service id
            options.push({
              label: reaction.name,
              value: reaction.reaction_id.toString(),
              service: services.filter(
                (service: Service) => service.service_id === reaction.service_id
              )[0].name,
              arguments: reaction.arguments
                ? Object.keys(reaction.arguments)
                : null,
            });
          }
        });
        setOptionsReaction(options);
        const optionsFiltered = options.filter(
          (option: Option) => option.value == area.reaction_id.toString()
        );
        if (optionsFiltered.length == 0) optionsFiltered.push(options[0]);

        setReaction(optionsFiltered[0]);
        optionsFiltered[0].arguments?.forEach((argument: string) => {
          newArgs.reaction[argument] =
            area.reaction_arguments && area.reaction_arguments[argument]
              ? area.reaction_arguments[argument]
              : '';
        });
      } else {
        setOptionsReaction([]);
        setReaction({
          value: undefined,
          label: undefined,
          service: undefined,
          arguments: undefined,
        });
      }
      setArguments(newArgs);
    })();
  }, []);

  if (!action || !optionsAction || !reaction || !optionsReaction) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }
  return (
    <div id={styles.page}>
      <NavBar />
      <div id={styles.content}>
        <p>Edit area</p>
        <form onSubmit={handleSubmit}>
          <Input
            id="title"
            value={title}
            onChange={handleTitle}
            label="Title"
          />
          <Select
            id="action"
            optionSelected={action}
            onChange={handleAction}
            options={optionsAction}
            label="Action"
          />
          {action?.arguments?.map((argument: string, index: number) => (
            <Input
              id={'action arg' + index}
              value={args.action[argument]}
              key={index}
              onChange={e => handleArgument(e, argument, 'action')}
              label={argument.charAt(0).toUpperCase() + argument.slice(1)}
              tabLeft={true}
            />
          ))}
          <Select
            id="reaction"
            optionSelected={reaction}
            onChange={handleReaction}
            options={optionsReaction}
            label="Reaction"
          />
          {reaction?.arguments?.map((argument: string, index: number) => (
            <Input
              id={'reaction arg' + index}
              value={args.reaction[argument]}
              key={index}
              onChange={e => handleArgument(e, argument, 'reaction')}
              label={argument.charAt(0).toUpperCase() + argument.slice(1)}
              tabLeft={true}
            />
          ))}
          {errorForm && (
            <p className={styles.errorForm}>
              One or more fields are incorrect.
            </p>
          )}
          <Button type={'submit'}>Update</Button>
        </form>
      </div>
    </div>
  );
};

export default EditArea;

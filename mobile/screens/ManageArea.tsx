import {View, Text, ScrollView} from 'react-native';
import {useState, useEffect} from 'react';
import Header from '../components/Header';
import DropDownList from '../components/DropDownList';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import IparamsNav from '../Iparams';
import theme from '../utils/theme';
import {useFocusEffect} from '@react-navigation/native';

const ManageArea = (params: IparamsNav) => {
  const [title, setTitle] = useState('');
  const [currentAction, setCurrentAction] = useState(null);
  const [parsedAction, setParsedAction] = useState(null);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [parsedReaction, setParsedReaction] = useState(null);
  const [args, setArguments] = useState({action: {}, reaction: {}});
  const [errorForm, setErrorForm] = useState(false);

  const handleAction = (index: number) => {
    setErrorForm(false);
    if (parsedAction) setCurrentAction(parsedAction[index]);
    args.action = {};
  };

  const handleReaction = (index: number) => {
    setErrorForm(false);
    if (parsedReaction) setCurrentReaction(parsedReaction[index]);
    args.reaction = {};
  };

  const handleArgument = (e: string, argument: string, type: string) => {
    const newActions = args.action;
    const newReactions = args.reaction;
    if (type === 'action') newActions[argument] = e;
    else newReactions[argument] = e;

    setArguments({
      action: newActions,
      reaction: newReactions,
    });
  };

  const handleSubmit = async () => {
    if (!formIsValid()) {
      setErrorForm(true);
      return;
    }
    axios
      .post(
        `http://${params.route.params.target.ip}:${params.route.params.target.port}/dashboard`,
        {
          title: title,
          user_id: params.route.params.data.user_id,
          action_id: currentAction.id,
          reaction_id: currentReaction.id,
          action_arguments:
            Object.keys(args.action).length === 0 ? null : args.action,
          reaction_arguments:
            Object.keys(args.reaction).length === 0 ? null : args.reaction,
        },
        {
          headers: {
            Authorization: `Bearer ${params.route.params.data.token}`,
          },
        }
      )
      .then(() => {
        params.navigation.navigate('Dashboard');
      })
      .catch(error => {
        console.log('[Mobile] Error - Could not create new area:', error);
      });
  };

  const handleEdit = async () => {
    if (!formIsValid()) {
      setErrorForm(true);
      return;
    }
    axios
      .put(
        `http://${params.route.params.target.ip}:${params.route.params.target.port}/dashboard/${params.route.params.areaId}`,
        {
          title: title,
          user_id: params.route.params.data.user_id,
          action_id: currentAction.id,
          reaction_id: currentReaction.id,
          action_arguments:
            Object.keys(args.action).length === 0 ? null : args.action,
          reaction_arguments:
            Object.keys(args.reaction).length === 0 ? null : args.reaction,
        },
        {
          headers: {
            Authorization: `Bearer ${params.route.params.data.token}`,
          },
        }
      )
      .then(() => {
        params.route.params.edit = false;
        params.navigation.navigate('Dashboard');
      })
      .catch(error => {
        console.log(
          `[Mobile] Error - Could not edit area ${params.route.params.areaId}:`,
          error
        );
      });
  };

  const formIsValid = () => {
    if (!title || title.length === 0 || !currentAction || !currentReaction)
      return false;
    let error = false;
    currentAction.arguments.forEach(argument => {
      if (!args.action[argument] || args.action[argument].length === 0)
        error = true;
    });
    currentReaction.arguments.forEach(argument => {
      if (!args.reaction[argument] || args.reaction[argument].length === 0)
        error = true;
    });
    if (error) return false;
    return true;
  };

  async function get_all_signed_in_services() {
    const services = {
      '1': 'google',
      '2': 'weather',
      '3': 'facebook',
      '4': 'todoist',
      '5': 'spotify',
      '6': 'github',
    };
    const connected_services: string[] = ['2'];

    for (let service_id = 1; service_id <= 6; service_id++) {
      const response = await axios
        .post(
          `http://${params.route.params.target.ip}:${params.route.params.target.port}/oauth/isconnected`,
          {
            name: services[service_id.toString()],
          },
          {
            headers: {
              Authorization: `Bearer ${params.route.params.data.token}`,
            },
          }
        )
        .catch(error => {
          console.log(
            '[Mobile] Error - Service: Could not verify user connection',
            error
          );
        });
      if (response?.data.message === 'Is connected')
        connected_services.push(service_id.toString());
    }
    return connected_services;
  }

  async function getAllInteractions(services_ids: string[]) {
    axios
      .get(
        `http://${params.route.params.target.ip}:${params.route.params.target.port}/actions`,
        {
          headers: {
            Authorization: `Bearer ${params.route.params.data.token}`,
          },
        }
      )
      .then(response => {
        const parsedActions = [];
        let index = 0;
        response.data.forEach(item => {
          if (item.arguments === null) item.arguments = [];

          if (services_ids.includes(item.service_id.toString())) {
            parsedActions.push({
              id: item.action_id,
              value: index,
              arguments: Object.keys(item.arguments).reverse(),
              label: item.name,
            });
            index++;
          }
        });
        setParsedAction(parsedActions);
      })
      .catch(error => {
        console.log('[Mobile] Error - Could not receive actions:', error);
      });
    axios
      .get(
        `http://${params.route.params.target.ip}:${params.route.params.target.port}/reactions`,
        {
          headers: {
            Authorization: `Bearer ${params.route.params.data.token}`,
          },
        }
      )
      .then(response => {
        let index = 0;
        const parsedReactions = [];
        response.data.forEach(item => {
          if (item.arguments === null) item.arguments = [];

          if (services_ids.includes(item.service_id.toString())) {
            parsedReactions.push({
              id: item.reaction_id,
              value: index,
              arguments: Object.keys(item.arguments).reverse(),
              label: item.name,
            });
            index++;
          }
        });
        setParsedReaction(parsedReactions);
      })
      .catch(error => {
        console.log('[Mobile] Error - Could not receive reactions:', error);
      });
  }

  useEffect(() => {
    if (parsedAction && currentAction === null)
      setCurrentAction(parsedAction[0]);
    else if (parsedAction && currentAction !== null)
      setCurrentAction(currentAction);

    if (parsedReaction && currentReaction === null)
      setCurrentReaction(parsedReaction[0]);
    else if (parsedReaction && currentReaction !== null)
      setCurrentReaction(currentReaction);

    if (params.route.params.edit) setTitle(params.route.params.areaTitle);
  }, [parsedAction, parsedReaction]);

  useFocusEffect(() => {
    const intervalID = setInterval(() => {
      get_all_signed_in_services().then(services_ids => {
        getAllInteractions(services_ids);
      });
      return;
    }, 5000);
    return () => clearInterval(intervalID);
  });

  if (!parsedAction || !parsedReaction) {
    get_all_signed_in_services().then(services_ids => {
      getAllInteractions(services_ids);
    });
    return (
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontWeight: '500', fontSize: 20, color: theme.DarkBlue}}>
          Loading
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.White,
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <View style={{flex: 2}}>
        {!params.route.params.edit ? (
          <Header title="Create a new area" />
        ) : (
          <Header title="Edit an area" />
        )}
      </View>
      <View style={{flex: 8}}>
        {!params.route.params.edit ? (
          <Input
            title="Title"
            placeholder="My Title"
            updator={setTitle}
            secureTextEntry={false}
          />
        ) : (
          <Input
            title="Title"
            placeholder={params.route.params.areaTitle}
            updator={setTitle}
            secureTextEntry={false}
          />
        )}
        <View style={{zIndex: 102, maxHeight: '32%'}}>
          <DropDownList
            title="Action"
            placeholder="Select an action"
            data={parsedAction}
            updator={handleAction}
          />
          <ScrollView>
            {currentAction &&
              currentAction.arguments &&
              currentAction.arguments.map((argument: string, index: number) => {
                return (
                  <Input
                    updator={e => handleArgument(e, argument, 'action')}
                    title={argument.charAt(0).toUpperCase() + argument.slice(1)}
                    tabLeft={true}
                    key={index}
                    secureTextEntry={false}
                  />
                );
              })}
          </ScrollView>
        </View>
        <View style={{zIndex: 101, maxHeight: '32%'}}>
          <DropDownList
            title="Reaction"
            placeholder="Select a reaction"
            data={parsedReaction}
            updator={handleReaction}
          />
          <ScrollView>
            {currentReaction &&
              currentReaction.arguments &&
              currentReaction.arguments.map(
                (argument: string, index: number) => {
                  return (
                    <Input
                      updator={e => handleArgument(e, argument, 'reaction')}
                      title={
                        argument.charAt(0).toUpperCase() + argument.slice(1)
                      }
                      tabLeft={true}
                      key={index}
                    />
                  );
                }
              )}
          </ScrollView>
        </View>
        {errorForm && (
          <Text
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '500',
              fontSize: 18,
              color: theme.Purple,
            }}
          >
            One or more fields are incorrect.
          </Text>
        )}
        {!params.route.params.edit ? (
          <Button title="Create area" onPress={handleSubmit} />
        ) : (
          <Button title="Confirm editing" onPress={handleEdit} />
        )}
        {params.route.params.edit ? (
          <Button
            title="Cancel editing"
            onPress={() => {
              params.route.params.edit = false;
              params.navigation.navigate('Dashboard');
            }}
          />
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};

export default ManageArea;

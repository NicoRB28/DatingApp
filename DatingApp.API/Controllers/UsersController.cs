
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{   
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UsersController: ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        private int GetCurrentUserId(){
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            //probar con el metodo privado que cree para no repetir codigo.
            //var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var userFromRepo = await _repo.GetUser(this.GetCurrentUserId());
            
            userParams.UserId = this.GetCurrentUserId();

            if(string.IsNullOrEmpty(userParams.Gender))
            {
                if (userFromRepo.Gender == "male")
                {
                  userParams.Gender = "female";  
                }
                else
                {
                    userParams.Gender = "male";
                }
            }
            
            var users = await _repo.GetUsers(userParams);
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDto>>(users);
            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDto>(user);
            //map toma el <t> como destino y transforma el (origen) en ese destino

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto UserForUpdateDto){

            if(id != this.GetCurrentUserId()){
                return Unauthorized();
            }    

            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(UserForUpdateDto, userFromRepo);
            if(await _repo.SaveAll()){
                return NoContent();
            }

            throw new Exception($"Updating user {id} failed on save");
        }
    }
}